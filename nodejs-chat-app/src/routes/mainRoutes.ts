import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("Welcome to cyrille Hounvio Todo application");
});
router.get(
  "/api/main",
  function (req: Request, res: Response, next: NextFunction) {
    res.json({
      name: "Cyrille Senami Hounvio",
      email: "cyrisenahoun@gmail.com",
    });
  }
);

export default router;
