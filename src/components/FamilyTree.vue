<template>
  <div class="family-tree">
    <h3 class="tree-title">{{ $t('tree.title') }}</h3>
    
    <div class="tree-container">
      <svg ref="treeSvg" class="tree-svg" viewBox="0 0 800 600">
        <!-- Family tree connections -->
        <g class="connections">
          <line 
            v-for="connection in connections" 
            :key="`${connection.from}-${connection.to}`"
            :x1="connection.x1" 
            :y1="connection.y1"
            :x2="connection.x2" 
            :y2="connection.y2"
            stroke="#e5e7eb" 
            stroke-width="2"
          />
        </g>
        
        <!-- Family member nodes -->
        <g class="members">
          <g 
            v-for="position in memberPositions" 
            :key="position.member.id"
            :transform="`translate(${position.x}, ${position.y})`"
            class="member-node"
            @click="showMemberDetails(position.member)"
          >
            <!-- Member circle -->
            <circle 
              r="40"
              :fill="getMemberColor(position.member)"
              :stroke="getMemberBorderColor(position.member)"
              stroke-width="3"
              class="member-circle"
            />
            
            <!-- Member icon -->
            <text 
              text-anchor="middle" 
              dy="5" 
              class="member-icon"
              :fill="getMemberTextColor(position.member)"
            >
              {{ getMemberIcon(position.member) }}
            </text>
            
            <!-- Member name/role -->
            <text 
              text-anchor="middle" 
              dy="60" 
              class="member-label"
            >
              {{ getMemberLabel(position.member) }}
            </text>
            
            <!-- Share display -->
            <text 
              v-if="getMemberShare(position.member)"
              text-anchor="middle" 
              dy="75" 
              class="member-share"
            >
              {{ getMemberShare(position.member) }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    
    <!-- Legend -->
    <div class="tree-legend">
      <div class="legend-item">
        <div class="legend-color inherits"></div>
        <span>{{ $t('tree.legend.inherits') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color blocked"></div>
        <span>{{ $t('tree.legend.blocked') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color fardh"></div>
        <span>{{ $t('tree.legend.fardh') }}</span>
      </div>
      <div class="legend-item">
        <div class="legend-color asabah"></div>
        <span>{{ $t('tree.legend.asabah') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '../composables/useI18n';
import type { FamilyMember, InheritanceShare, FamilyRole } from '../types/inheritance';

interface Props {
  familyMembers: FamilyMember[];
  shares: InheritanceShare[];
}

interface MemberPosition {
  member: FamilyMember;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  memberClick: [member: FamilyMember];
}>();

const { t } = useI18n();
const treeSvg = ref<SVGElement>();

// Family tree layout positions
const memberPositions = computed((): MemberPosition[] => {
  const positions: MemberPosition[] = [];
  const centerX = 400;
  const centerY = 300;
  
  // Define position layout based on family roles
  const rolePositions: Record<FamilyRole, { x: number; y: number }> = {
    // Grandparents level (top)
    paternal_grandfather: { x: centerX - 200, y: 100 },
    paternal_grandmother: { x: centerX - 100, y: 100 },
    maternal_grandmother: { x: centerX + 100, y: 100 },
    
    // Parents level
    father: { x: centerX - 150, y: 200 },
    mother: { x: centerX + 150, y: 200 },
    
    // Spouse level (same as deceased)
    husband: { x: centerX - 100, y: 300 },
    wife: { x: centerX + 100, y: 300 },
    
    // Siblings level
    full_brother: { x: centerX - 300, y: 300 },
    full_sister: { x: centerX - 250, y: 300 },
    paternal_brother: { x: centerX - 200, y: 350 },
    paternal_sister: { x: centerX - 150, y: 350 },
    maternal_brother: { x: centerX + 200, y: 350 },
    maternal_sister: { x: centerX + 250, y: 350 },
    
    // Children level (bottom)
    son: { x: centerX - 100, y: 450 },
    daughter: { x: centerX + 100, y: 450 },
    grandson_son: { x: centerX - 50, y: 500 },
    granddaughter_son: { x: centerX + 50, y: 500 },
    
    // Extended family
    paternal_uncle: { x: centerX - 350, y: 200 },
    paternal_nephew: { x: centerX - 400, y: 350 }
  };
  
  props.familyMembers.forEach(member => {
    const position = rolePositions[member.role];
    if (position) {
      positions.push({
        member,
        x: position.x,
        y: position.y
      });
    }
  });
  
  return positions;
});

// Generate connection lines between related family members
const connections = computed((): Connection[] => {
  const connections: Connection[] = [];
  const positionMap = new Map(memberPositions.value.map(p => [p.member.role, p]));
  
  // Define family relationships that should be connected
  const relationships: Array<[FamilyRole, FamilyRole]> = [
    ['paternal_grandfather', 'father'],
    ['paternal_grandmother', 'father'],
    ['father', 'son'],
    ['father', 'daughter'],
    ['mother', 'son'], 
    ['mother', 'daughter'],
    ['father', 'full_brother'],
    ['father', 'full_sister'],
    ['mother', 'full_brother'],
    ['mother', 'full_sister'],
  ];
  
  relationships.forEach(([from, to]) => {
    const fromPos = positionMap.get(from);
    const toPos = positionMap.get(to);
    
    if (fromPos && toPos) {
      connections.push({
        from,
        to,
        x1: fromPos.x,
        y1: fromPos.y,
        x2: toPos.x,
        y2: toPos.y
      });
    }
  });
  
  return connections;
});

function getMemberColor(member: FamilyMember): string {
  const share = props.shares.find(s => s.memberId === member.id);
  
  if (!share) return '#ef4444'; // Red for blocked/no inheritance
  
  switch (share.shareType) {
    case 'fardh': return '#14b8a6'; // Teal for fixed shares
    case 'asabah': return '#f59e0b'; // Amber for residuary
    case 'blocked': return '#ef4444'; // Red for blocked
    default: return '#6b7280'; // Gray default
  }
}

function getMemberBorderColor(member: FamilyMember): string {
  const baseColor = getMemberColor(member);
  return baseColor === '#ef4444' ? '#dc2626' : 
         baseColor === '#14b8a6' ? '#0f766e' :
         baseColor === '#f59e0b' ? '#d97706' : '#4b5563';
}

function getMemberTextColor(member: FamilyMember): string {
  return 'white';
}

function getMemberIcon(member: FamilyMember): string {
  const iconMap: Record<FamilyRole, string> = {
    father: '👨', mother: '👩', son: '👦', daughter: '👧',
    husband: '🤵', wife: '👰', full_brother: '👨', full_sister: '👩',
    paternal_brother: '👨', paternal_sister: '👩',
    maternal_brother: '👨', maternal_sister: '👩',
    paternal_grandfather: '👴', paternal_grandmother: '👵',
    maternal_grandmother: '👵', paternal_uncle: '👨',
    paternal_nephew: '👨', grandson_son: '👦', granddaughter_son: '👧'
  };
  
  return iconMap[member.role] || '👤';
}

function getMemberLabel(member: FamilyMember): string {
  if (member.name) return member.name;
  return t(`roleLabels.${member.role}`) || t('common.unknown');
}

function getMemberShare(member: FamilyMember): string {
  const share = props.shares.find(s => s.memberId === member.id);
  if (!share) return t('common.blocked');
  
  if (share.amount) {
    return `${share.share.numerator}/${share.share.denominator} (${share.amount.toLocaleString()})`;
  }
  
  return `${share.share.numerator}/${share.share.denominator}`;
}

function showMemberDetails(member: FamilyMember) {
  emit('memberClick', member);
}
</script>

<style scoped>
.family-tree {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tree-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 24px;
}

.tree-container {
  width: 100%;
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
}

.tree-svg {
  width: 100%;
  height: 100%;
}

.member-node {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.member-node:hover {
  transform: scale(1.1);
}

.member-circle {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: filter 0.2s ease;
}

.member-node:hover .member-circle {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.member-icon {
  font-size: 20px;
  font-weight: bold;
}

.member-label {
  font-size: 12px;
  font-weight: 600;
  fill: #374151;
}

.member-share {
  font-size: 11px;
  font-weight: 500;
  fill: #059669;
}

.tree-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
}

.legend-color.inherits {
  background: #10b981;
  border-color: #059669;
}

.legend-color.blocked {
  background: #ef4444;
  border-color: #dc2626;
}

.legend-color.fardh {
  background: #14b8a6;
  border-color: #0f766e;
}

.legend-color.asabah {
  background: #f59e0b;
  border-color: #d97706;
}

@media (max-width: 768px) {
  .tree-container {
    height: 400px;
  }
  
  .tree-legend {
    gap: 16px;
  }
  
  .legend-item {
    font-size: 12px;
  }
}
</style>