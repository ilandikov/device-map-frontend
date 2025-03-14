export const erroneousSubscriber = (subscriber) => {
    subscriber.error();
    subscriber.complete();

    return () => subscriber.unsubscribe();
};
