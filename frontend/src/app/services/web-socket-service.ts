import {RxStompService} from '@stomp/ng2-stompjs';
import {Observable, Subscriber} from 'rxjs';
import {IFrame} from "@stomp/stompjs/src/i-frame";
import {environment} from '../../environments/environment';

export class WebSocketService {
  private obsStompConnection: Observable<any> | undefined;
  private subscribers: Array<any> = [];
  private subscriberIndex = 0;

  constructor(
    private stompService: RxStompService,
    private topic: string
  ) {
    this.createObservableSocket();
    this.connect();
  }

  private createObservableSocket = () => {
    this.obsStompConnection = new Observable(observer => {
      const subscriberIndex = this.subscriberIndex++;
      this.addToSubscribers({index: subscriberIndex, observer});
      return () => {
        this.removeFromSubscribers(subscriberIndex);
      };
    });
  }

  private addToSubscribers = (subscriber: { index: number; observer: Subscriber<any>; }) => {
    this.subscribers.push(subscriber);
  }

  private removeFromSubscribers = (index: number) => {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (i === index) {
        this.subscribers.splice(i, 1);
        break;
      }
    }
  }

  private connect = () => {
    const brokerURL: string = environment.webSocketURL == undefined ? this.getFromRelativeUrl() : environment.webSocketURL;
    this.stompService.stompClient.configure({
      brokerURL: brokerURL,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000
    });
    this.stompService.stompClient.onConnect = this.onSocketConnect;
    this.stompService.stompClient.onStompError = this.onSocketError;
    this.stompService.stompClient.activate();
  }

  private getFromRelativeUrl(): string {
    var loc = window.location, new_uri;
    if (loc.protocol === "https:") {
      new_uri = "wss:";
    } else {
      new_uri = "ws:";
    }
    new_uri += "//" + loc.host;
    new_uri += loc.pathname + "/ws";
    console.log(new_uri)
    return new_uri;
  }

  private onSocketConnect = () => {
    this.stompService.stompClient.subscribe(this.topic, this.socketListener);
  }

  private onSocketError = (errorMsg: IFrame) => {
    this.subscribers.forEach(subscriber => {
      subscriber.observer.error({
        type: 'ERROR',
        message: errorMsg.body
      });
    });
  }

  private socketListener = (frame: any) => {
    this.subscribers.forEach(subscriber => {
      subscriber.observer.next(this.getMessage(frame));
    });
  }

  private getMessage = (data: { body: string; }) => {
    return {
      type: 'SUCCESS',
      message: JSON.parse(data.body)
    };
  }

  public getObservable = () => {
    return this.obsStompConnection;
  };

}
