import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsComponent } from "./tabs.component";
import { TabItemComponent } from "./tab-item/tab-item.component";
import { TabLabelComponent } from "./tab-label/tab-label.component";
import { TabBodyComponent } from "./tab-body/tab-body.component";
import { TabCloseComponent } from "./tab-close/tab-close.component";

@NgModule({
  declarations: [
    TabsComponent,
    TabItemComponent,
    TabLabelComponent,
    TabBodyComponent,
    TabCloseComponent,
  ],
  imports: [CommonModule],
  exports: [
    TabsComponent,
    TabItemComponent,
    TabBodyComponent,
    TabLabelComponent,
    TabCloseComponent,
  ],
})
export class TabsModule {}
