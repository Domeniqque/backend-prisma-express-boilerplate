import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';

@Service()
@JsonController('/account/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
