import Leave from "./Leave";
import Pause from "./Pause";
import Ping from "./Ping";
import Play from "./Play";
import Queue from "./Queue";
import Resume from "./Resume";
import Stop from "./Stop";
import Summon from "./Summon";

export const Commands: (typeof Leave | typeof Pause | typeof Ping | typeof Play | typeof Queue | typeof Stop | typeof Summon)[] = [
    Leave,
    Pause,
    Ping,
    Play,
    Resume,
    Queue,
    Stop,
    Summon,
]