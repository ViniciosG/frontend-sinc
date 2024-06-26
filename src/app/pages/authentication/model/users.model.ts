export class UsersTypesModel {
  id: number;
}

export class UsersPersonsModel {
  birth: any;
  address: any;
}

export class Context {
  id: number;
}


export class UsersModel {
  internal_id: number;
  persons: UsersPersonsModel;
  auth: string;
  active: boolean;
  user_type: UsersTypesModel;
  authorization: string;
  context: Context
}


