import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CoreClassesModule } from './core-classes.module';
import { ClassMembershipsModule } from './memberships/memberships.module';
import { SchoolYearsModule } from './school-year/school-years.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'classes',
      children: [
        // Endpoints to manage the core class concept
        { path: 'org', module: CoreClassesModule },
        // Endpoints to manage school years
        { path: 'school-years', module: SchoolYearsModule },
        // Endpoint to manage class members
        { path: 'memberships', module: ClassMembershipsModule },
      ],
    }]),
    CoreClassesModule,
    SchoolYearsModule,
    ClassMembershipsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ClassesModule {}
