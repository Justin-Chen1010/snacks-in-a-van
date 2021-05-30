const request = require("supertest");
const app = require("../../app");

describe("Integration test: change vendor status", () => {
  let agent = request.agent(app);

  // have user agent login before doing any tests
  beforeAll(() =>
    agent
      .post("/vendor/login")
      .set("Content-Type", "application/x-www-form-urlencoded")
      // send the username and password
      .send({
        vendorName: "test",
        password: "password1",
      })
      .then((res) => {
        // set cookie for authentication
        res.headers["set-cookie"][0]
          .split(",")
          .map((item) => item.split(";")[0])
          .forEach((c) => agent.jar.setCookie(c));
      })
      .catch((err) => {
        console.log(err);
      })
  );

  test("Change vendor status", () => {
    // send a status/location update and check that it has been updated
    return agent
      .put("/vendor/status")
      .set("Content-Type", "application/json")
      .send({
        open: true,
        lat: -35.329810371317826,
        lon: 149.1720054092145,
        address: "Fyshwick near Canberra",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          open: true,
          lat: -35.329810371317826,
          lon: 149.1720054092145,
          address: "Fyshwick near Canberra",
        });
      });
  });
});
