CREATE OR REPLACE FUNCTION update_penjualan() RETURNS TRIGGER AS $set_penjualan$
    DECLARE
    stock_lama INTEGER;
    sum_harga NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN 
            SELECT stock INTO stock_lama FROM barang WHERE id_barang = NEW.id_barang;
            UPDATE barang SET stock = stock_lama - NEW.qty WHERE id_barang = NEW.id_barang;
          
        ELSIF (TG_OP = 'UPDATE') THEN
            --upadte stock
            SELECT stock INTO stock_lama FROM barang WHERE id_barang = NEW.id_barang;
            UPDATE barang SET stock = stock_lama - OLD.qty + NEW.qty WHERE id_barang = NEW.id_barang;
          
        ELSIF (TG_OP = 'DELETE') THEN
            --upadte stock
            SELECT stock INTO stock_lama FROM barang WHERE id_barang = NEW.id_barang;
            UPDATE barang SET stock = stock_lama + NEW.qty WHERE id_barang = NEW.id_barang;

        END IF;
        --update penjualan--
        SELECT sum(total_harga) INTO sum_harga FROM detail_penjualan WHERE no_invoice = NEW.no_invoice;
        UPDATE penjualan SET total_harga = sum_harga WHERE penjualan.no_invoice = NEW.no_invoice;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_penjualan$ LANGUAGE plpgsql;

CREATE TRIGGER set_penjualan
AFTER INSERT OR UPDATE OR DELETE ON detail_penjualan
    FOR EACH ROW EXECUTE FUNCTION update_penjualan();


--update total harga
CREATE OR REPLACE FUNCTION update_harga() RETURNS TRIGGER AS $set_total_harga$
    DECLARE
    harga_jual_barang NUMERIC;
    BEGIN
        SELECT harga_jual INTO harga_jual_barang FROM barang WHERE id_barang = NEW.id_barang;
        NEW.harga_jual := harga_jual_barang;
        NEW.total_harga := NEW.qty * harga_jual_barang;
        RETURN NEW;
    END;
$set_total_harga$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_harga
BEFORE INSERT OR UPDATE ON detail_penjualan
    FOR EACH ROW EXECUTE FUNCTION update_harga();