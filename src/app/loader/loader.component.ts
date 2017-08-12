import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() size = '10em';
  @Input() border = '1.1em';
  @Input() activeColor = '#FFFFFF';
  @Input() color = 'rgba(255, 255, 255, 0.2)';
}
