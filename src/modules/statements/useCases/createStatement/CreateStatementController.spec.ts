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

      const response = await request(app)
          .post("/api/v1/statements/deposit")
          .send({
            amount: 100,
            description: "Mock deposit"
          })
          .set({
              Authorization: `Bearer ${token}`,
          });

      expect(response.status).toBe(201);
    });

    it("should be able to make a withdraw", async () => {

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

      const response = await request(app)
          .post("/api/v1/statements/withdraw")
          .send({
            amount: 50,
            description: "Mock withdraw"
          })
          .set({
              Authorization: `Bearer ${token}`,
          });

      expect(response.status).toBe(201);
    });
});
