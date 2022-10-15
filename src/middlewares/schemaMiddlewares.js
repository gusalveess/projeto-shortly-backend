export function schemaValidationMiddleware(schema) {
    return (req, res, next) => {
      const validation = schema.validate(req.body);
      if (validation.error) {
        res.status(409).send('Inválido');
        return;
      }
      next();
    };
  }
  