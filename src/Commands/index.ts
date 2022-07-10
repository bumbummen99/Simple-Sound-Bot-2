import Avatar from "./Avatar";
import Leave from "./Leave";
import Name from "./Name";
import Pause from "./Pause";
import Ping from "./Ping";
import Play from "./Play";
import Queue from "./Queue";
import Repeat from "./Repeat";
import Resume from "./Resume";
import Skip from "./Skip";
import Stop from "./Stop";
import Summon from "./Summon";
import TTS from "./TTS";
import Volume from "./Volume";

export const Commands: (typeof Leave | typeof Pause | typeof Ping | typeof Play | typeof Queue | typeof Stop | typeof Summon)[] = [
    Avatar,
    Leave,
    Name,
    Pause,
    Ping,
    Play,
    Queue,
    Repeat,
    Resume,
    Skip,
    Stop,
    Summon,
    TTS,
    Volume,
]