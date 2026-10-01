import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog #dialog aria-labelledby="dialog-title" (click)="onBackdrop($event)">
    <div class="dialog-heading">
      <h2 id="dialog-title">{{ heading() }}</h2>
      <button type="button" aria-label="Close dialog" (click)="close()">×</button>
    </div>
    <p>{{ description() }}</p>
    <ng-content />
  </dialog>`,
})
export class ModalComponent {
  readonly heading = input.required<string>();
  readonly description = input('');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  open(): void {
    this.dialog().nativeElement.showModal();
  }
  close(): void {
    this.dialog().nativeElement.close();
  }
  onBackdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      this.close();
  }
}
