import {Injectable} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {WebSocketService} from './web-socket-service';

@Injectable({providedIn: 'root'})
export class LogService extends WebSocketService {
  constructor(stompService: RxStompService) {
    super(
      stompService,
      '/topic/progress'
    );
  }
}
