using mydb from '../db/schema';

service CatalogService {

    entity Products as projection on mydb.Products;
    annotate Products with @odata.draft.enabled;
}