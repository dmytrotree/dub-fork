import { openApiErrorResponses } from "@/lib/openapi/responses";
import z, { workspaceIdSchema } from "@/lib/zod";
import { getLinksCountQuerySchema, LinkSchema } from "@/lib/zod/schemas/links";
import { ZodOpenApiOperationObject } from "zod-openapi";

export const getLinksCount: ZodOpenApiOperationObject = {
  operationId: "getLinksCount",
  summary: "Retrieve the number of links",
  description:
    "Retrieve the number of links for the authenticated workspace. The provided query parameters allow filtering the returned links.",
  requestParams: {
    query: workspaceIdSchema.merge(getLinksCountQuerySchema),
  },
  responses: {
    "200": {
      description: "A list of links",
      content: {
        "application/json": {
          schema: z.array(LinkSchema),
        },
      },
    },
    ...openApiErrorResponses,
  },
  tags: ["Links"],
  security: [{ bearerToken: [] }],
};
