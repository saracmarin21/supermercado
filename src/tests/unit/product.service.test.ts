import { ProductService } from '../../services/ProductService';
import { ProductRepository } from '../../repositories/ProductRepository';

describe('ProductService', () => {
  let productService: ProductService;
  let mockProductRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategory: jest.fn(),
      updateStock: jest.fn()
    };

    jest.spyOn(ProductRepository.prototype, 'find').mockImplementation(mockProductRepository.find);
    jest.spyOn(ProductRepository.prototype, 'findOne').mockImplementation(mockProductRepository.findOne);
    jest.spyOn(ProductRepository.prototype, 'create').mockImplementation(mockProductRepository.create);
    jest.spyOn(ProductRepository.prototype, 'save').mockImplementation(mockProductRepository.save);
    jest.spyOn(ProductRepository.prototype, 'update').mockImplementation(mockProductRepository.update);
    jest.spyOn(ProductRepository.prototype, 'delete').mockImplementation(mockProductRepository.delete);
    jest.spyOn(ProductRepository.prototype, 'findByCategory').mockImplementation(mockProductRepository.findByCategory);
    jest.spyOn(ProductRepository.prototype, 'updateStock').mockImplementation(mockProductRepository.updateStock);

    productService = new ProductService();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10, stock: 100 },
        { id: 2, name: 'Product 2', price: 20, stock: 200 }
      ];

      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10, stock: 100 };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await productService.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await productService.getProductById(999);

      expect(result).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        price: 15,
        stock: 50,
        category: 'Test Category'
      };

      const mockProduct = { id: 1, ...productData };

      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(productData);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(productData);
      expect(mockProductRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const productId = 1;
      const updateData = { name: 'Updated Product', price: 25 };
      const mockUpdatedProduct = { id: productId, ...updateData };

      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockProductRepository.findOne.mockResolvedValue(mockUpdatedProduct);

      const result = await productService.updateProduct(productId, updateData);

      expect(result).toEqual(mockUpdatedProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updateData);
    });

    it('should throw error if product not found', async () => {
      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(productService.updateProduct(999, { name: 'Test' }))
        .rejects.toThrow('Producto no encontrado');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await productService.deleteProduct(1);

      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if product not found', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(productService.deleteProduct(999))
        .rejects.toThrow('Producto no encontrado');
    });
  });
});
