import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-tab-label",
  templateUrl: "./tab-label.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabLabelComponent<T> implements OnInit {
  @ViewChild(TemplateRef)
  labelContent: TemplateRef<T>;

  constructor() {}

  ngOnInit(): void {}
}
