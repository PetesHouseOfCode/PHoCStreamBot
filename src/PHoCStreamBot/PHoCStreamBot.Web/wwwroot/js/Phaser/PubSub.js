"use strict";

var messages = {},
    lastUid = -1;

function hasKeys(obj) {
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

function throwException(ex) {
    return function reThrowException() {
        throw ex;
    };
}

function callSubscriberWithDelayedExceptions(subscriber, message, data) {
    try {
        subscriber.func.call(subscriber.context, message, data);
    } catch (ex) {
        setTimeout(throwException(ex), 0);
    }
}

function callSubscriberWithImmediateExceptions(subscriber, message, data) {
    subscriber.func.call(subscriber.context, message, data);
}

function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
    var subscribers = messages[matchedMessage],
        callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
        s;

    if (!messages.hasOwnProperty(matchedMessage)) {
        return;
    }

    for (s in subscribers) {
        if (subscribers.hasOwnProperty(s)) {
            callSubscriber(subscribers[s], originalMessage, data);
        }
    }
}

function createDeliveryFunction(message, data, immediateExceptions) {
    return function deliverNamespaced() {
        var topic = String(message),
            position = topic.lastIndexOf('.');

        // deliver the message as it is now
        deliverMessage(message, message, data, immediateExceptions);

        // trim the hierarchy and deliver message to each level
        while (position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf('.');
            deliverMessage(message, topic, data, immediateExceptions);
        }
    };
}

function messageHasSubscribers(message) {
    var topic = String(message),
        found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic])),
        position = topic.lastIndexOf('.');

    while (!found && position !== -1) {
        topic = topic.substr(0, position);
        position = topic.lastIndexOf('.');
        found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
    }

    return found;
}

export default {
    receive(message, func, context) {
        if (typeof func !== 'function') {
            return false;
        }

        context = context || this;

        message = (typeof message === 'symbol') ? message.toString() : message;

        // message is not registered yet
        if (!messages.hasOwnProperty(message)) {
            messages[message] = {};
        }

        var token = 'uid_' + String(++lastUid);
        messages[message][token] = { func: func, context: context };

        // return token for unsubscribing
        return token;
    },

    dispatch(message, data, sync, immediateExceptions) {
        message = (typeof message === 'symbol') ? message.toString() : message;

        var deliver = createDeliveryFunction(message, data, immediateExceptions),
            hasSubscribers = messageHasSubscribers(message);

        if (!hasSubscribers) {
            return false;
        }

        if (sync === true) {
            deliver();
        } else {
            setTimeout(deliver, 0);
        }
        return true;
    }
};
