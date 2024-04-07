import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-tab-body",
  templateUrl: "./tab-body.component.html",
})
export class TabBodyComponent<T> implements OnInit {
  @ViewChild(TemplateRef)
  bodyContent: TemplateRef<T>;

  constructor() {}

  ngOnInit(): void {}
}
