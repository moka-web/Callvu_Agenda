import { Cliente } from '../../types';
import { IClienteRepository } from './cliente.repository';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

export class ClienteService {
  constructor(private readonly repository: IClienteRepository) {}

  async createCliente(dto: CreateClienteDto): Promise<Cliente> {
    const existing = await this.repository.findByTelefono(dto.telefono);
    if (existing) {
      throw new Error('Un cliente con este teléfono ya existe');
    }
    return this.repository.create(dto);
  }

  async getClienteById(id: string): Promise<Cliente> {
    const cliente = await this.repository.findById(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  async getClienteByTelefono(telefono: string): Promise<Cliente | null> {
    return this.repository.findByTelefono(telefono);
  }

  async getAllClientes(): Promise<Cliente[]> {
    return this.repository.findAll();
  }

  async updateCliente(id: string, dto: UpdateClienteDto): Promise<Cliente> {
    await this.getClienteById(id);
    if (dto.telefono) {
      const existing = await this.repository.findByTelefono(dto.telefono);
      if (existing && existing.id !== id) {
        throw new Error('El teléfono ya pertenece a otro cliente');
      }
    }
    return this.repository.update(id, dto);
  }

  async deleteCliente(id: string): Promise<void> {
    await this.getClienteById(id);
    return this.repository.delete(id);
  }
}
