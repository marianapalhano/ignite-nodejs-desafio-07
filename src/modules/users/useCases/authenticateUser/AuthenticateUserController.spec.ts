import { hash } from "bcryptjs";
import request from "supertest";
import { createConnection, Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuid();
        const password = await hash("1234", 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, created_at, updated_at )
        values('${id}', 'Mock User', 'mockuser@mail.com', '${password}', 'now()', 'now()')
      `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to authenticate a registered user", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: "mockuser@mail.com",
            password: "1234",
        });

        expect(response.body).toHaveProperty("token");
    });
});
