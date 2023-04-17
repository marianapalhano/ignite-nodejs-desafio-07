import request from "supertest";
import { createConnection, Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to make a deposit", async () => {

      await request(app).post("/api/v1/users")
        .send({
          name: "Mock User",
          email: "mockuser@mail.com",
          password: "1234"
      });

      const responseToken = await request(app).post("/api/v1/sessions").send({
          email: "mockuser@mail.com",
          password: "1234"
      });

      const { token } = responseToken.body;

      const responseStatement = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
          amount: 100,
          description: "Mock deposit"
        })
        .set({
            Authorization: `Bearer ${token}`,
        });

      const response = await request(app)
        .get(`/api/v1/statements/${responseStatement.body.id}`)
        .set({
            Authorization: `Bearer ${token}`,
        });

        expect(response.body).toHaveProperty("id");
    });
});
