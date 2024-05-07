CREATE TABLE person(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    pass VARCHAR(255)
);

CREATE TABLE price(
    id BIGSERIAL PRIMARY KEY,
    bitprice REAL
);

SELECT * FROM person;
SELECT * FROM price;