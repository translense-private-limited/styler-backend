export class CategoryWithServiceCountDto {
  /**
   * The unique identifier of the category.
   */
  categoryId: string;

  /**
   * The name of the category (e.g., Hair Care, Skin Care).
   */
  categoryName: string;

  /**
   * The description of the category.
   */
  categoryDescription: string;

  /**
   * The count of services available in this category for the specified outlet.
   */
  serviceCount: number;
}
