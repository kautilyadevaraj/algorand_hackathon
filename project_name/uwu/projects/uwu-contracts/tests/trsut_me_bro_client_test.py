import algokit_utils
import pytest
from algokit_utils import (
    AlgoAmount,
    AlgorandClient,
    SigningAccount,
)

from smart_contracts.artifacts.trsut_me_bro.trsut_me_bro_client import (
    TrsutMeBroClient,
    TrsutMeBroFactory,
)


@pytest.fixture()
def deployer(algorand_client: AlgorandClient) -> SigningAccount:
    account = algorand_client.account.from_environment("DEPLOYER")
    algorand_client.account.ensure_funded_from_environment(
        account_to_fund=account.address, min_spending_balance=AlgoAmount.from_algo(10)
    )
    return account


@pytest.fixture()
def trsut_me_bro_client(
    algorand_client: AlgorandClient, deployer: SigningAccount
) -> TrsutMeBroClient:
    factory = algorand_client.client.get_typed_app_factory(
        TrsutMeBroFactory, default_sender=deployer.address
    )

    client, _ = factory.deploy(
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
        on_update=algokit_utils.OnUpdate.AppendApp,
    )
    return client


def test_says_hello(trsut_me_bro_client: TrsutMeBroClient) -> None:
    result = trsut_me_bro_client.send.hello(args=("World",))
    assert result.abi_return == "Hello, World"


def test_simulate_says_hello_with_correct_budget_consumed(
    trsut_me_bro_client: TrsutMeBroClient,
) -> None:
    result = (
        trsut_me_bro_client.new_group()
        .hello(args=("World",))
        .hello(args=("Jane",))
        .simulate()
    )
    assert result.returns[0].value == "Hello, World"
    assert result.returns[1].value == "Hello, Jane"
    assert result.simulate_response["txn-groups"][0]["app-budget-consumed"] < 100
