import { Cliente } from '../../types';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

export interface IClienteRepository {
  create(dto: CreateClienteDto): Promise<Cliente>;
  findById(id: string): Promise<Cliente | null>;
  findByTelefono(telefono: string): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  update(id: string, dto: UpdateClienteDto): Promise<Cliente>;
  delete(id: string): Promise<void>;
}
