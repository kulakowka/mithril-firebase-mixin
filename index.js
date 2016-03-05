/**
 * Based on https://gist.github.com/webcss/e4aaa7d95342d107e1ce
 */

module.exports = function firebaseMixin (m, target) {
  var OBJECT = '[object Object]'

  var type = {}.toString
  var _references = []

  function unify (key, value) {
    if (type.call(value) !== OBJECT || !value) {
      value = { '.value': value }
    }
    value._id = key
    return value
  }

  function findIndex (arr, key) {
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i]._id === key) {
        return i
      }
    }
    return -1
  }

  // using the Firebase API's prevChild behavior, we
  // place each element in the list after it's prev
  // sibling or, if prevChild is null, at the beginning
  function positionAfter (arr, prevChild) {
    var idx
    if (prevChild === null) {
      return 0
    } else {
      idx = findIndex(arr, prevChild)
      return (idx === -1) ? arr.length : idx + 1
    }
  }

  /**
   * getData - retrieve the data at the specified firebase location once
   * param @reference firebaseReference - firebase reference to write to
   * param @oncomplete function - callback function with fetched data
   *
   */
  target.getData = function (reference, oncomplete) {
    reference.once('value', function (snap) {
      oncomplete.call(target, snap.val())
      m.redraw()
    })
  }

  /**
   * onlivedata - listen to firebase live data changes
   * param @reference firebaseReference - firebase reference to write to
   * param @ondata function - callback function with updated data
   * param @asObject boolean - optional, pass a truthy value to receive a
   *              complete snapshot.val() rather than an array
   *
   */
  target.onlivedata = function (reference, ondata, asObject) {
    // save the reference for later removal of eventlisteners
    _references.push(reference)

    // add eventlistener
    if (asObject) {
      reference.on('value', function (snap) {
        ondata.call(target, snap.val())
        m.redraw()
      })
    } else {
      var out = []

      reference.on('child_added', function (snap, prevChild) {
        var pos
        var idx = findIndex(out, snap.key())
        if (idx < 0) {
          pos = positionAfter(out, prevChild)
          out.splice(pos, 0, unify(snap.key(), snap.val()))
          ondata.call(target, out)
          m.redraw()
        }
      })

      reference.on('child_changed', function (snap) {
        var idx = findIndex(out, snap.key())
        if (idx > -1) {
          out[idx] = unify(snap.key(), snap.val())
          ondata.call(target, out)
          m.redraw()
        }
      })

      reference.on('child_removed', function (snap) {
        var idx = findIndex(out, snap.key())
        out.splice(idx, 1)
        ondata.call(target, out)
        m.redraw()
      })

      reference.on('child_moved', function (snapshot, prevChild) {
        var data
        var newpos
        var idx = findIndex(out, snapshot.key())
        if (idx > -1) {
          data = out.splice(idx, 1)[0]
          newpos = positionAfter(out, prevChild)
          out.splice(newpos, 0, data)
          ondata.call(target, out)
          m.redraw()
        }
      })
    }
  }

  /**
   * bindFirebase - helper function to bind an input value to a firebase location
   * param @ref firebaseReference - firebase reference to write to
   * param @key string - key index
   * param @property string - key property to bind to
   * param @attr string - HTML attribute to bind to
   * return mithril m.withAttr function
   *
   */
  target.bindFirebase = function (reference, key, childProp, attr) {
    return m.withAttr(attr, function (value) {
      reference.child(key).child(childProp).set(value)
    })
  }

  // save a reference to a possible present unload method
  var _savedUnload = (target.onunload) ? target.onunload : null

  target.onunload = function () {
    while (_references.length) {
      _references.pop().off()
    }
    _savedUnload && _savedUnload()
  }

  return target
}
