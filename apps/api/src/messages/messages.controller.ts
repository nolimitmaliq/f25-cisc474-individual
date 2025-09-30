import { Controller, Get,Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from '@repo/database';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id);    
}
}