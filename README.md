# AngularCanvas

Angular canvas renderer.


# Examples

Graph example:

```ts
@CanvasElement({
  selector: 'graph-line'
})
export class GraphLineElement implements NgCanvasElement {
  ...
}
```

Register element
```ts
imports: [
    CanvasDomModule.forRoot(
    [
      GraphLineElement,
      ...
    ]
  ),
```


```html
<p>Graph example</p>

<canvas class="first">
  <rect [x]="mouseX" [y]="20" w="20" h="20"></rect>
  <line [x1]="10" [x2]="100" [y1]="10" [y2]="200"></line>
</canvas>
<canvas>
  <graph-line [data]="data" [step]="step" [deltaX]="deltaX" strokeStyle="orange" ></graph-line>
  <graph-line [data]="data2" [step]="step"  [deltaX]="deltaX"  strokeStyle="green"></graph-line>
  <graph-line [data]="data3" [deltaX]="deltaX" strokeStyle="blue" ></graph-line>
</canvas>

```

<img src ="https://github.com/irustm/angular-canvas/blob/master/assets/graph-example.png?raw=true">
