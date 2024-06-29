import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CreatePatientController } from './controllers/create-patient.controller';
import { CreateDoctorController } from './controllers/create-doctor.controller';
import { FetchAllDoctorsController } from './controllers/fetch-all-doctors.controller';
import { envSchema } from './env';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
	],
	controllers: [
		CreatePatientController,
		CreateDoctorController,
		FetchAllDoctorsController,
	],
	providers: [PrismaService],
})
export class AppModule {}
