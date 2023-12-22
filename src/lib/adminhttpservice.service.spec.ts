import {Test, TestingModule} from '@nestjs/testing';
import {AdminHttpService} from "./AdminHttpService";

describe('HttpserviceService', () => {
    let service: AdminHttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminHttpService],
        }).compile();

        service = module.get<AdminHttpService>(AdminHttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
