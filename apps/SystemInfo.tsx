import React from 'react';
import { useSecurity } from '../contexts/SecurityContext';

const MOCK_IPS = {
  'local': { ip: '192.168.1.101', location: 'Local Network', provider: 'Home ISP' },
  'us-east': { ip: '23.94.12.118', location: 'Ashburn, USA', provider: 'SecureNet' },
  'eu-central': { ip: '85.214.132.117', location: 'Frankfurt, DE', provider: 'EuroVPN' },
  'asia-east': { ip: '103.27.237.221', location: 'Tokyo, JP', provider: 'SakuraNet' },
};

const SystemInfo: React.FC = () => {
    const { vpnStatus, vpnServer, firewallLevel, encryptionLevel, securityScore } = useSecurity();
    
    const currentNetwork = vpnStatus === 'Connected' ? MOCK_IPS[vpnServer as keyof typeof MOCK_IPS] : MOCK_IPS['local'];

    const getScoreColor = (score: number) => {
        if (score < 500) return 'text-red-400';
        if (score < 800) return 'text-yellow-400';
        return 'text-green-400';
    }

    const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold text-right">{value}</span>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-800 text-white p-4 font-sans flex flex-col">
            <header className="text-center pb-3 border-b border-gray-700 mb-3">
                <h1 className="text-xl font-bold">System Information</h1>
                <p className="text-sm text-gray-400">Live security & network status</p>
            </header>
            <div className="space-y-2">
                <InfoRow label="DefenseAI Score" value={<span className={getScoreColor(securityScore)}>{securityScore} / 1000</span>} />
                <InfoRow label="VPN Status" value={vpnStatus} />
                <InfoRow label="Public IP Address" value={currentNetwork.ip} />
                <InfoRow label="IP Location" value={currentNetwork.location} />
                <InfoRow label="Network Provider" value={currentNetwork.provider} />
                <InfoRow label="Firewall Level" value={firewallLevel} />
                <InfoRow label="Encryption Protocol" value={encryptionLevel} />
            </div>
        </div>
    );
}

export default SystemInfo;
