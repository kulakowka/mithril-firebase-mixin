# mithril-firebase-mixin

Mixin for mithril controllers to enable firebase livedata

```javascript
import m from 'mithril'
import firebaseMixin from 'mithril-firebase-mixin'

const ref = new Firebase('https://<myfirebase>.firebaseio.com')

const Example = {
  controller (args) {
    firebaseMixin(m, this)

    this.onData(ref.child('users/kulakowka'), (data) => (this.user = data))
    this.onLiveData(ref.child('users'), (data) => (this.users = data))
  },

  view (ctrl) {
    return (
      {ctrl.user && ctrl.user.username}

      <ul>
        {ctrl.users && ctrl.users.map(user => {
          <li>{user.username}</li>
        })}
      </ul>
    )
  }
}

export default Example
```
