const vendorController = require("../../controllers/vendorController");
const Vendor = require("../../models/vendor");

describe("get one valid vendor from vendorController", function () {
  // set up mock request and response
  const req = {
    session: {
      vendorName: "DebugaSnacks",
    },
  };
  const res = {
    send: jest.fn(),
  };

  beforeAll(() => {
    res.send.mockClear();

    // mock the vendor to be retrieved
    Vendor.findOne = jest.fn().mockResolvedValue({
      _id: "60b21c2cc804863e2812e5e0",
      role: "vendor",
      vendorName: "DebugaSnacks",
      open: true,
      password: "$2b$10$fd81W8zwdrKEeTJCkQYhPuXlgNJYQ4L.ivh.HDc1ptAxDm4nxEzxW",
      address: "Moon",
      lat: -37.8569,
      lon: 145.3064,
      __v: 0,
    });
    vendorController.getOneVendor(req, res);
  });

  // valid vendor, should be able to receive a response
  test("Test case 1: getting a valid vendor's details", () => {
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      _id: "60b21c2cc804863e2812e5e0",
      role: "vendor",
      vendorName: "DebugaSnacks",
      open: true,
      password: "$2b$10$fd81W8zwdrKEeTJCkQYhPuXlgNJYQ4L.ivh.HDc1ptAxDm4nxEzxW",
      address: "Moon",
      lat: -37.8569,
      lon: 145.3064,
      __v: 0,
    });
  });
});

describe("get one invalid vendor's status from vendorController", function () {
  const req = {
    session: {
      vendorName: "InvalidVendor",
    },
  };

  const res = {
    status: jest.fn(),
    send: jest.fn(),
  };

  beforeAll(() => {
    res.send.mockClear();
    res.status.mockClear();
    // mock the vendor to be retrieved: none
    Vendor.findOne = jest.fn().mockResolvedValue(null);

    vendorController.getOneVendor(req, res);
  });

  // invalid vendor, should receive a 404 error
  test("Test case 1: getting an invalid vendor's details", () => {
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith("Vendor not found");
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("update one valid vendor's status", function () {
  const req = {
    session: {
      vendorName: "DebugaSnacks",
    },
    body: {
      open: true,
      lat: 39,
      lon: 93,
      address: "University of Melbourne",
    },
  };

  const res = {
    send: jest.fn(),
    status: jest.fn(),
  };

  beforeAll(() => {
    res.send.mockClear();
    res.status.mockClear();

    // mock the vendor to be retrieved
    Vendor.findOne = jest.fn().mockResolvedValue({
      _id: "60b21c2cc804863e2812e5e0",
      role: "vendor",
      vendorName: "DebugaSnacks",
      open: false,
      password: "$2b$10$fd81W8zwdrKEeTJCkQYhPuXlgNJYQ4L.ivh.HDc1ptAxDm4nxEzxW",
      address: "Moon",
      lat: null,
      lon: null,
      __v: 0,
    });
    Vendor.updateOne = jest.fn();
  });

  // valid vendor, receiving a successful response means it has been updated
  test("Test case 1: updating a valid vendor's status", () => {
    return vendorController.updateVanStatus(req, res).then((result) => {
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(req.body);
    });
  });
});