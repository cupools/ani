## ani

Experimental web animation solution, base on preact currently. It tends to make the work being easier to organize and maintain the animation data, thus provides a syntax that describes animations and some wrapper of animation library as animamtion engine. Ideally, we just need to write the configuration, or even Adobe toolkit offers that data, then the animation run as expected.

## ani-loader

Webpack loader that transforms the stynax to json object for animation engine. It's based on stylus and postcss, and try to describe most animation with least code.

```stylus
// raw
.foo
  width 10px
  height 10px
  opacity 1
  animation fade-in 1s,
            fade-out 2s 10ms ease-in 2
@fade-in
  opacity 1
@fade-out
  opacity 0
```

```js
// transformed
{
  '.foo': {
    width: '10px',
    height: '10px',
    opacity: 1,
    animation: 'fade-in 1s, fade-out 2s 10ms ease-in 2',
    keyframes: [{
      __aniName: 'fade-in',
      opacity: 1,
      duration: 1000
    }, {
      __aniName: 'fade-out',
      opacity: 0,
      duration: 2000,
      delay: 10,
      easing: 'ease-in',
      loop: 2
    }]
  }
}
```

Some one-time animation can be created as follow.

```stylus
.foo
  width 10px
  animation to(opacity, 1, translateY, 10px) 2s
```

```js
{
  '.foo': {
    width: '10px',
    animation: 'anonymous 2s',
    keyframes: [{
      __aniName: 'anonymous',
      opacity: 1,
      translateY: '10px',
      duration: 2000
    }]
  }
}
```

## velocity-component

A preact component based on velocity that accepts the above configuration and runs animation. Easy sample as follow.

```stylus
// animation.ani
.bar
  width 10px
  height 10px
  animation fade-in 1s 2s ease,
  			to(translateX, 10px, translateY, 10px) 1s linear,
  			fade-out 1s ease
```

```js
// Foo.js
import * as animation from './animation.ani'
import VelocityComponent from './ani/velocity-component'

class Foo extends Component {
  render() {
    return (
      <div>
      	<VelocityComponent animation={animation.bar} class="bar" />
      </div>
    )
  }
}
```

