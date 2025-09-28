import { Injectable } from '@nestjs/common';

@Injectable() // This AppService can be injected into other classes (like controllers or other services).
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

}
