import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-tab-close",
  templateUrl: "./tab-close.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabCloseComponent<T> implements OnInit {
  @ViewChild(TemplateRef)
  closeContent: TemplateRef<T>;

  constructor() {}

  ngOnInit(): void {}
}
