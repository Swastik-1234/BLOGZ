//import { Controller } from '@nestjs/common';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Next,
  HttpStatus,
  Param
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { TopicsService } from './topic.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { CreateTopicDto } from './dtos/topic.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { assignTopicRoleDto } from './dtos/assignTopicRole.dto';
import { ApiResponse } from 'src/utils/apiResponse';
import { customError } from 'src/utils/exceptionHandler';
import { Topic } from 'src/typeorm/entities/topic.entity';
import { updateTopicDto } from './dtos/updateTopicDto';



@UseGuards(JwtGuard, RolesGuard)
@Controller('topic')
export class TopicsController {

  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly jwtStrategy: JwtStrategy,
    private readonly topicsService: TopicsService,
  ) { }

  @HasRoles(Role.ADMIN, Role.SUPERADMIN)
  @Post('create')
  async createTopic(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    try {
      const id = uuid();
      createTopicDto.id = id;
      createTopicDto.ownerId = req['user']['userId'];
      const createTopicServiceResponse = await this.topicsService.createTopic(
        req['user']['userId'],
        createTopicDto,
      );
      if (createTopicServiceResponse instanceof customError) {
        throw createTopicServiceResponse
      }
      return new ApiResponse(
        HttpStatus.FOUND,
        'Topic Created Successfully',
        createTopicServiceResponse,
        res,
      );
    } catch (error) {
      next(error)
    }
  }

  @HasRoles(Role.SUPERADMIN, Role.ADMIN)
  @Post('assign-role')
  async assignTopicRole(
    @Body() assignTopicRoleDto: assignTopicRoleDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const fetchOwnerId = await this.topicRepository
        .createQueryBuilder()
        .select()
        .where(`ID = :ID`, { ID: assignTopicRoleDto.topicDetails })
        .getOne()

      if (req['user']['userId'] != fetchOwnerId.ownerId) {
        throw new customError(
          HttpStatus.FORBIDDEN,
          'Some Error Occured',
          'Access denied',
        );
      }
      const assignRoleResponse = await this.topicsService.assignTopicRole(assignTopicRoleDto)
      if (assignRoleResponse instanceof customError) {
        throw assignRoleResponse;
      }
      return new ApiResponse(
        HttpStatus.FOUND,
        'Role Assigned Successfully',
        assignRoleResponse,
        res,
      );
    } catch (error) {
      next(error);
    }
  }


  @HasRoles(Role.ADMIN, Role.SUPERADMIN)
  @Post(":id/update")
  async updateTopic(
    @Param() id: number,
    @Body() updateTopicDto: updateTopicDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const updateTopicResponse = await this.topicsService.updateTopic(req['user']['userId'], id['id'].toString(), updateTopicDto)
      if (updateTopicResponse instanceof customError) {
        throw updateTopicResponse
      }
      return new ApiResponse(
        HttpStatus.FOUND,
        'Topic Updated Successfully',
        updateTopicResponse,
        res,
      );
    } catch (error) {
      next(error)
    }
  }



  @HasRoles(Role.VIEWER)
  @Get(':id')
  async getTopicById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction, @Param('id') id: string) {

    try {
      const userId = req['user']['userId'];
      // Fetch topic by ID
      const getTopicByIdResponse = await this.topicsService.getTopicById(userId, id);
      if (getTopicByIdResponse instanceof customError) {
        throw getTopicByIdResponse
      }
      return new ApiResponse(
        HttpStatus.FOUND,
        'Role Assigned Successfully',
        getTopicByIdResponse,
        res,
      );
    } catch (error) {
      next(error)
    }
  }

  @HasRoles(Role.VIEWER)
  @Get()
  async getTopics(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    try {
      const reqUserId = req['user']['userId']
      const getAlltopicsResponse = await this.topicsService.getTopics(reqUserId);
      if (getAlltopicsResponse instanceof customError) {
        throw getAlltopicsResponse;
      }
      return new ApiResponse(
        HttpStatus.FOUND,
        'Data Fetched Successfully',
        getAlltopicsResponse,
        res,
      );
    } catch (error) {
      next(error)
    }
  }
}
