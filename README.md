# mithril-firebase-mixin

Mixin for mithril controllers to enable firebase livedata

```javascript
import m from 'mithril'
import firebaseMixin from 'mithril-firebase-mixin'

const ref = new Firebase('https://<myfirebase>.firebaseio.com/posts')

const Posts = {
  controller (args) {
    var scope = firebaseMixin(m, this)

    scope.onlivedata(ref, (data) => (scope.list = data))
  },

  view (ctrl) {
    return (
      <ul>
        {ctrl.list && ctrl.list.map(post => {
          <li>{post.title}</li>
        })}
      </ul>
    )
  }
}

export default Posts
```
