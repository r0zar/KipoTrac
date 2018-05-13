export class Item {
    Id: number;
    Name: string;
    ItemCategory: string;
    ProductCategoryName: string;
    ProductCategoryType: string;
    QuantityType: string;
    DefaultLabTestingState: number;
    UnitOfMeasure: string;
    UnitOfMeasureName: string;
    StrainId: number;
    Strain: string;
    StrainName: string;
    UnitThcContent: number;
    UnitThcContentUnitOfMeasureName: string;
    UnitVolume: number;
    UnitVolumeUnitOfMeasureName: string;
    UnitWeight: number;
    UnitWeightUnitOfMeasureName: string;

    constructor(options: any) {
        this.Id = Number(options.Id);
        this.Name = options.Name || '';
        this.ItemCategory = options.ItemCategory || options.ProductCategoryName || '';
        this.ProductCategoryName = options.ProductCategoryName || '';
        this.ProductCategoryType = options.ProductCategoryType || '';
        this.QuantityType = options.QuantityType || '';
        this.DefaultLabTestingState = Number(options.DefaultLabTestingState);
        this.UnitOfMeasure = options.UnitOfMeasure || options.UnitOfMeasureName || '';
        this.UnitOfMeasureName = options.UnitOfMeasureName || '';
        this.StrainId = Number(options.StrainId);
        this.Strain = options.Strain || options.StrainName;
        this.StrainName = options.StrainName || '';
        this.UnitThcContent = Number(options.UnitThcContent);
        this.UnitThcContentUnitOfMeasureName = options.UnitThcContentUnitOfMeasureName || 'Milligrams';
        this.UnitVolume = Number(options.UnitVolume);
        this.UnitVolumeUnitOfMeasureName = options.UnitVolumeUnitOfMeasureName || 'Milliliters';
        this.UnitWeight = Number(options.UnitWeight);
        this.UnitWeightUnitOfMeasureName = options.UnitWeightUnitOfMeasureName || 'Milligrams';
    }
}

export class ItemDetail {
    Id: number;
    Name: string;
    ItemCategory: string;
    UnitOfMeasure: string;
    Strain: string;
    UnitThcContent: number;
    UnitThcContentUnitOfMeasure: string;
    UnitVolume: number;
    UnitVolumeUnitOfMeasure: string;
    UnitWeight: number;
    UnitWeightUnitOfMeasure: string;

  constructor(options: any) {
      this.Id = Number(options.Id);
      this.Name = options.Name || '';
      this.ItemCategory = options.ProductCategoryName || '';
      this.UnitOfMeasure = options.UnitOfMeasureName || '';
      this.Strain = options.StrainName || '';
      this.UnitThcContent = Number(options.UnitThcContent);
      this.UnitThcContentUnitOfMeasure = options.UnitThcContentUnitOfMeasureName || 'Milligrams';
      this.UnitVolume = Number(options.UnitVolume);
      this.UnitVolumeUnitOfMeasure = options.UnitVolumeUnitOfMeasureName || 'Milliliters';
      this.UnitWeight = Number(options.UnitWeight);
      this.UnitWeightUnitOfMeasure = options.UnitWeightUnitOfMeasureName || 'Milligrams';
  }
}
