import request from "supertest";
import { createConnection, Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Get Balance", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get a user's balance", async () => {

      await request(app).post("/api/v1/users")
        .send({
          name: "Mock User",
          email: "mockuser@mail.com",
          password: "1234"
      });

      const responseToken = await request(app).post("/api/v1/sessions").send({
          email: "mockuser@mail.com",
          password: "1234",
      });

      const { token } = responseToken.body;

      const response = await request(app)
          .get("/api/v1/statements/balance")
          .set({
              Authorization: `Bearer ${token}`,
          });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("balance");
      expect(response.body.balance).toEqual(0);
    });
});
