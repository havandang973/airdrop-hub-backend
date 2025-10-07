import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class EventService extends EventEmitter2 {
  constructor() {
    super();
  }
}
