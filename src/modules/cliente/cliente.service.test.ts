import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClienteService } from './cliente.service';
import { IClienteRepository } from './cliente.repository';
import { CreateClienteDto } from './dto/cliente.dto';

describe('ClienteService (TDD Unit Tests)', () => {
  let service: ClienteService;
  let mockRepository: IClienteRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByTelefono: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new ClienteService(mockRepository);
  });

  describe('createCliente', () => {
    it('debe crear un nuevo cliente si el teléfono no está registrado', async () => {
      const dto: CreateClienteDto = {
        nombre: 'Juan Pérez',
        telefono: '+5491112345678',
        email: 'juan@example.com',
      };

      const expectedCliente = {
        id: 'uuid-cliente-1',
        ...dto,
        createdAt: new Date(),
      };

      vi.spyOn(mockRepository, 'findByTelefono').mockResolvedValue(null);
      vi.spyOn(mockRepository, 'create').mockResolvedValue(expectedCliente);

      const cliente = await service.createCliente(dto);

      expect(mockRepository.findByTelefono).toHaveBeenCalledWith(dto.telefono);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(cliente).toEqual(expectedCliente);
    });

    it('debe lanzar un error si ya existe un cliente con el mismo teléfono', async () => {
      const dto: CreateClienteDto = {
        nombre: 'María López',
        telefono: '+5491187654321',
      };

      const existingCliente = {
        id: 'uuid-existente',
        nombre: 'María Existente',
        telefono: '+5491187654321',
        createdAt: new Date(),
      };

      vi.spyOn(mockRepository, 'findByTelefono').mockResolvedValue(existingCliente);

      await expect(service.createCliente(dto)).rejects.toThrow(
        'Un cliente con este teléfono ya existe'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getClienteById', () => {
    it('debe retornar un cliente existente', async () => {
      const mockCliente = {
        id: 'uuid-cliente-1',
        nombre: 'Carlos Gómez',
        telefono: '+5491155554444',
        createdAt: new Date(),
      };

      vi.spyOn(mockRepository, 'findById').mockResolvedValue(mockCliente);

      const result = await service.getClienteById('uuid-cliente-1');
      expect(result).toEqual(mockCliente);
    });

    it('debe lanzar error si el cliente no existe', async () => {
      vi.spyOn(mockRepository, 'findById').mockResolvedValue(null);

      await expect(service.getClienteById('inexistente')).rejects.toThrow(
        'Cliente no encontrado'
      );
    });
  });
});
