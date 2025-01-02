import { all } from 'redux-saga/effects';
import { taskCreationSaga } from './sagas.mock';

export default function* rootSaga() {
    yield all([
        taskCreationSaga()
    ]);
}