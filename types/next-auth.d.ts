import { Role } from "@prisma/client";

declare module "@auth/core/types" {
  interface User {
    id: string;
    empresaId: string;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    empresaId: string;
    role: Role;
  }
}
