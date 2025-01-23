export type DeviceItemType = 'create' | 'created' | 'approving' | 'approved';

export function getDeviceItemType(approvals: number): DeviceItemType {
    switch (true) {
        case approvals < 0:
            return 'create';
        case approvals === 0:
            return 'created';
        case approvals === 1:
            return 'approving';
        case approvals >= 2:
            return 'approved';
        default:
            throw new Error(`Unknown approval count: ${approvals}`);
    }
}
