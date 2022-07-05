import {connect, Msg, NatsError, StringCodec} from "nats.ws";

async function main(): Promise<void> {
    console.log("connecting to server");
    const nc = await connect({
        servers: "ws://localhost:9222",
        reconnect: true,
    })

    console.log("connected", nc.getServer());

    nc.subscribe("msg", {
        callback: onMessage
    })

    function sendMessage(msg: string): void {
        nc.publish("msg", StringCodec().encode(msg));
    }

    (window as any)["msg"] = sendMessage;
}

function onMessage(err: (NatsError | null), msg: Msg): void {
    if (!err) {
        console.log("message:", StringCodec().decode(msg.data));
    } else {
        console.error(err);
    }
}

main().then(() => console.log("started"));


