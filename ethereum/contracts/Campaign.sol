// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution; 
    mapping(address => bool) public approvers;
    mapping(uint => Request) public requests;
    uint public approversCount;
    uint public requestsCount;
    uint requestIndex = 0;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Minimum contribution amount not met");

        // increase count if new contributor
        if (!approvers[msg.sender]) {
            approversCount++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        // Check if balance available
        require(value <= address(this).balance);

        Request storage request = requests[requestIndex];

        request.description = description;
        request.recipient = recipient;
        request.value = value;
        request.complete = false;
        request.approvalCount = 0;
        
        requestIndex++;
        requestsCount++;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]); // make sure is constributer
        require(!request.approvals[msg.sender]); // make sure already not a voter
        
        // add vote
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        
        // transfer and complete request
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint,
        uint,
        uint,
        uint,
        address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }

}