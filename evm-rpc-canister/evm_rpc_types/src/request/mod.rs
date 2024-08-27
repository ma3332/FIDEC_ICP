use crate::{BlockTag, Nat256};
use candid::CandidType;
use serde::Deserialize;

#[derive(Clone, Debug, PartialEq, Eq, CandidType, Deserialize)]
pub struct FeeHistoryArgs {
    /// Number of blocks in the requested range.
    /// Typically, providers request this to be between 1 and 1024.
    #[serde(rename = "blockCount")]
    pub block_count: Nat256,

    /// Highest block of the requested range.
    /// Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions.
    #[serde(rename = "newestBlock")]
    pub newest_block: BlockTag,

    /// A monotonically increasing list of percentile values between 0 and 100.
    /// For each block in the requested range, the transactions will be sorted in ascending order
    /// by effective tip per gas and the corresponding effective tip for the percentile
    /// will be determined, accounting for gas consumed.
    #[serde(rename = "rewardPercentiles")]
    pub reward_percentiles: Option<Vec<u8>>,
}
