// export interface Log {
//     type: String;
//     task?: String;
//     project?: String;
//     date: String;
//     startTime: timestamp;
//     endTime: timestamp;
//   }
  
export class Log {
    $key: string;
    title: string;
    type: String;
    task?: String;
    project?: String;
    duration: number;
    body: string;
    active = true;
}
  