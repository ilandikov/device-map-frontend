import React from 'react';
import terminals from '../../../assets/images/Terminals.png';

export function CreateDeviceItem() {
    const leftShadowClass = 'device-list-create-device-item-shadow-left';
    const rightShadowClass = 'device-list-create-device-item-shadow-right';

    return (
        <div className="device-list-item-container">
            <div className={`device-list-item-shadow device-list-item-shadow-left ${leftShadowClass}`}></div>
            <div className={`device-list-item-shadow device-list-item-shadow-right ${rightShadowClass}`}></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">
                <p className="device-list-item-opaque-text">Тут пока нет терминала</p>
                <button>Добавить терминал</button>
            </div>
        </div>
    );
}
